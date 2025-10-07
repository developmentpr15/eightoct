import 'package:flutter/material.dart';

class CustomButton extends StatelessWidget {
  final String text;
  final VoidCallback onPressed;
  final Gradient? gradient;
  final Color? color;
  final double? width;
  final double? height;
  final TextStyle? textStyle;
  final EdgeInsetsGeometry? padding;
  final BorderRadius? borderRadius;
  final bool isLoading;

  const CustomButton({
    super.key,
    required this.text,
    required this.onPressed,
    this.gradient,
    this.color,
    this.width,
    this.height,
    this.textStyle,
    this.padding,
    this.borderRadius,
    this.isLoading = false,
  });

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: width,
      height: height ?? 56,
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: isLoading ? null : onPressed,
          borderRadius: borderRadius ?? BorderRadius.circular(16),
          child: Container(
            decoration: BoxDecoration(
              gradient: gradient ?? (color != null ? null : AppTheme.primaryGradient),
              color: color,
              borderRadius: borderRadius ?? BorderRadius.circular(16),
              boxShadow: [
                if (gradient != null || color != null)
                  BoxShadow(
                    color: (gradient?.colors.first ?? color ?? AppTheme.accentColor).withOpacity(0.3),
                    blurRadius: 12,
                    offset: const Offset(0, 6),
                  ),
              ],
            ),
            child: Center(
              child: isLoading
                  ? const SizedBox(
                      width: 24,
                      height: 24,
                      child: CircularProgressIndicator(
                        strokeWidth: 2,
                        valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                      ),
                    )
                  : Text(
                      text,
                      style: textStyle ??
                          const TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w600,
                            color: Colors.white,
                          ),
                    ),
            ),
          ),
        ),
      ),
    );
  }
}