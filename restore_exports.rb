#!/usr/bin/env ruby
# Restore Ember exports

require 'colorize'

def print_status(status, color, message)
  puts "[#{status.to_s.colorize(:color => color, :mode => :bold)}] #{message}"
end

def restore_exports
  templates = Dir["./addon/templates/**/*.hbs"]
  templates.map! do |filename|
    filename.scan(/\.\/addon\/templates\/(.*)\.hbs/).flatten.first
  end
  templates.each do |template|
    message = "Exporting template: #{template.to_s.colorize(:color => :magenta)}"

    STDOUT.print "[#{"…".to_s.colorize(:color => :white)}] #{message}"
    ret = %x(echo -ne "n\n" | ember g template #{template})
    if ret.lines.last.match /\s+create.*/
      print_status "+", :green, message
    elsif ret.lines.last.match /\s+identical.*/
      print_status "=", :yellow, message
    else
      print_status "?", :red, message
    end
  end
end

if __FILE__ == $0
  restore_exports
end
